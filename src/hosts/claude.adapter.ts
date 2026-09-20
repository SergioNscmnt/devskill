import { join } from 'node:path';
import type { InstallScope } from '../models/skill.js';
import type { PathContext } from '../utils/paths.js';
import type { HostAdapter } from './host-adapter.js';

export const claudeAdapter: HostAdapter = {
  name: 'claude',
  executable: 'claude',
  invocation(skillName, args) {
    return [`/${skillName}`, ...args].join(' ');
  },
  installationDirectory(scope: InstallScope, context: PathContext) {
    const root = scope === 'project' ? context.projectRoot : context.userHome;
    return join(root, '.claude', 'skills');
  },
};
