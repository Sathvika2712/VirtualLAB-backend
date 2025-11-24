export const PROJECT_STATUSES = ["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TERMINAL_DISTROS = ["UBUNTU", "KALI", "FEDORA", "DEBIAN"] as const;
export type TerminalDistro = (typeof TERMINAL_DISTROS)[number];

export const TERMINAL_STATUSES = ["PROVISIONING", "READY", "STOPPED", "FAILED"] as const;
export type TerminalStatus = (typeof TERMINAL_STATUSES)[number];

