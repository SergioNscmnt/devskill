import type {
  HostName,
  InstallScope,
} from '../models/skill.js';
import type { PathContext } from '../utils/paths.js';

export interface HostAdapter {
  readonly name: HostName;
  readonly executable: string;
  invocation(skillName: string, args: readonly string[]): string;
  installationDirectory(
    scope: InstallScope,
    context: PathContext,
  ): string;
}
