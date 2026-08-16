/**
 * VousTech Shield — Web Application Firewall (WAF) & Threat Signature Engine
 * Inspects incoming requests for malicious payloads, scanners, and exploit attempts.
 */

export interface WafInspectionResult {
  blocked: boolean;
  reason?: string;
  threatType?: "sqli" | "xss" | "rce" | "traversal" | "probing" | "bad_bot";
  severity?: "low" | "medium" | "high" | "critical";
}

// 1. Probing & Path Traversal Blacklist (Immediate 403)
const PROBING_PATH_PATTERNS = [
  /\/\.(env|git|svn|htaccess|htpasswd|aws|ssh|docker|DS_Store)/i,
  /\/(wp-admin|wp-login|wp-content|wp-includes|xmlrpc\.php)/i,
  /\/(phpmyadmin|pma|adminer|mysqladmin|dbadmin)/i,
  /\/(cgi-bin|\.well-known\/(?!ai\.txt|apple-developer-domain-association\.txt|appspecific))/i,
  /\/(actuator|console|manager\/html|web-console)/i,
  /\.(php|asp|aspx|jsp|cgi|pl|sh|bash|sql|bak|backup|config|yml|yaml|ini)$/i,
  /(\.\.|\%2e\%2e|\%252e\%252e)(\/|\\|\%2f|\%5c)/i, // Path traversal ../
];

// 2. SQL Injection Patterns
const SQLI_PATTERNS = [
  /(\b(union(\s+all)?\s+select|select\s+.*\s+from|insert\s+into|delete\s+from|drop\s+(table|database|view)|alter\s+table)\b)/i,
  /(\b(benchmark\s*\(|sleep\s*\(|waitfor\s+delay|pg_sleep\s*\()\b)/i,
  /('|\%27)\s*(or|and)\s*('|\%27)?\s*(\d+|\w+)\s*=\s*('|\%27)?\s*(\d+|\w+)/i, // ' OR '1'='1
  /(\b(information_schema|load_file|into\s+outfile|dumpfile)\b)/i,
  /(\b(declare\s+@|exec(\s*\(|\s+xp_))\b)/i,
];

// 3. Cross-Site Scripting (XSS) Patterns
const XSS_PATTERNS = [
  /(<|%3c)\s*(script|iframe|object|embed|applet|svg|meta|link|base)\b/i,
  /(javascript|vbscript|data):[^\n]+/i,
  /(\bon(error|load|click|mouseover|mouseenter|focus|blur|change|submit)\s*=)/i,
  /(document\.(cookie|location|write)|window\.location|eval\s*\(|new\s+Function\s*\()/i,
];

// 4. Remote Code Execution (RCE) & Command Injection Patterns
const RCE_PATTERNS = [
  /(\b(bin\/sh|bin\/bash|cmd\.exe|powershell(\.exe)?)\b)/i,
  /(;\s*(cat|ls|pwd|whoami|id|uname|curl|wget|nc|bash|sh|chmod|chown)\s+)/i,
  /(\|\s*(curl|wget|bash|sh)\s+)/i,
  /(\$\{jndi:(ldap|rmi|dns):)/i, // Log4j / JNDI injection
  /(\b(base64_decode|system|passthru|shell_exec|exec|proc_open|popen)\s*\()/i,
];

// 5. Malicious Automated Vulnerability Scanners & Bad Bots User-Agents
const BAD_USER_AGENTS = [
  /\b(sqlmap|nikto|acunetix|havij|nessus|openvas|masscan|zgrab|dirbuster|gobuster|wpscan|censys|shodan|nmap|morfeus|fuzz|arachni)\b/i,
  /\b(python-requests|go-http-client|curl\/[0-9]|urllib|libwww-perl|postmanruntime\/[0-9])/i,
];

// Whitelisted legitimate paths (e.g. RSS feed, sitemap, Google search console verification, static assets)
const WHITELIST_PATHS = [
  /^\/(_next|favicon\.ico|robots\.txt|sitemap\.xml|rss\.xml|manifest\.webmanifest|google[a-z0-9]+\.html|icon\.png|apple-icon\.png|brand\/)/i,
];

/**
 * Inspects a request URL, query parameters, and headers for known attacks.
 */
export function inspectRequest(
  pathname: string,
  searchParams: URLSearchParams,
  headers: Headers
): WafInspectionResult {
  // 1. Check if path is whitelisted static asset
  for (const whitelist of WHITELIST_PATHS) {
    if (whitelist.test(pathname)) {
      return { blocked: false };
    }
  }

  // 2. Inspect User-Agent
  const userAgent = headers.get("user-agent") || "";
  // Check if aggressive bad bot
  for (const pattern of BAD_USER_AGENTS) {
    // Only block if targeting non-standard endpoints with scanning tool user agents
    if (pattern.test(userAgent) && (pathname.includes("admin") || pathname.includes("api") || pathname.includes(".")) ) {
      return {
        blocked: true,
        reason: `Blocked malicious scanner user-agent: ${userAgent.slice(0, 40)}`,
        threatType: "bad_bot",
        severity: "high",
      };
    }
  }

  // 3. Inspect Path for Probing / Traversal
  for (const pattern of PROBING_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return {
        blocked: true,
        reason: `Blocked unauthorized system probe/traversal: ${pathname}`,
        threatType: "probing",
        severity: "critical",
      };
    }
  }

  // 4. Inspect Query Parameters & Path for Injections
  const queryString = searchParams.toString();
  const targetStrings = [pathname, queryString, decodeURIComponentSafe(queryString)];

  for (const target of targetStrings) {
    if (!target) continue;

    // Check SQLi
    for (const pattern of SQLI_PATTERNS) {
      if (pattern.test(target)) {
        return {
          blocked: true,
          reason: `Blocked SQL Injection payload signature: ${pattern.source}`,
          threatType: "sqli",
          severity: "critical",
        };
      }
    }

    // Check XSS
    for (const pattern of XSS_PATTERNS) {
      if (pattern.test(target)) {
        return {
          blocked: true,
          reason: `Blocked Cross-Site Scripting (XSS) payload signature`,
          threatType: "xss",
          severity: "high",
        };
      }
    }

    // Check RCE / Command Injection
    for (const pattern of RCE_PATTERNS) {
      if (pattern.test(target)) {
        return {
          blocked: true,
          reason: `Blocked Remote Code Execution (RCE) payload signature`,
          threatType: "rce",
          severity: "critical",
        };
      }
    }
  }

  return { blocked: false };
}

function decodeURIComponentSafe(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
