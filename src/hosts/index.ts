import type { HostAdapter } from './host-adapter.js';
import type { HostName, HostTarget } from '../models/skill.js';
import { claudeAdapter } from './claude.adapter.js';
import { codexAdapter } from './codex.adapter.js';

const adapters: Record<HostName, HostAdapter> = {
  codex: codexAdapter,
  claude: claudeAdapter,
};

export function getHostAdapter(name: HostName): HostAdapter {
  return adapters[name];
}

export function resolveHostAdapters(target: HostTarget): HostAdapter[] {
  return target === 'all'
    ? [codexAdapter, claudeAdapter]
    : [getHostAdapter(target)];
}
