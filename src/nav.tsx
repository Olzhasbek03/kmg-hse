import {
  IconDashboard,
  IconBook,
  IconShield,
  IconAlert,
  IconFactory,
  IconUsers,
  IconClipboard,
  IconCheck,
  IconDoc,
  IconTruck,
  IconForm,
  IconBrain,
  IconId,
} from './components/icons';
import type { ComponentType, SVGProps } from 'react';

export interface NavItem {
  to: string;
  labelKey: string;
  codeKey?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  group: 'modules' | 'analytics';
}

export const NAV: NavItem[] = [
  { to: '/command', labelKey: 'nav.command', codeKey: 'mod.command.code', icon: IconDashboard, group: 'modules' },
  { to: '/passport', labelKey: 'nav.passport', codeKey: 'mod.passport.code', icon: IconId, group: 'modules' },
  { to: '/policies', labelKey: 'nav.policies', codeKey: 'mod.policies.code', icon: IconBook, group: 'modules' },
  { to: '/korgau', labelKey: 'nav.korgau', codeKey: 'mod.korgau.code', icon: IconShield, group: 'modules' },
  { to: '/incidents', labelKey: 'nav.incidents', codeKey: 'mod.incidents.code', icon: IconAlert, group: 'modules' },
  { to: '/opo', labelKey: 'nav.opo', codeKey: 'mod.opo.code', icon: IconFactory, group: 'modules' },
  { to: '/contractors', labelKey: 'nav.contractors', codeKey: 'mod.contractors.code', icon: IconUsers, group: 'modules' },
  { to: '/measures', labelKey: 'nav.measures', codeKey: 'mod.measures.code', icon: IconClipboard, group: 'modules' },
  { to: '/audit', labelKey: 'nav.audit', codeKey: 'mod.audit.code', icon: IconCheck, group: 'modules' },
  { to: '/ptw', labelKey: 'nav.ptw', codeKey: 'mod.ptw.code', icon: IconDoc, group: 'modules' },
  { to: '/transport', labelKey: 'nav.transport', codeKey: 'mod.transport.code', icon: IconTruck, group: 'modules' },
  { to: '/forms', labelKey: 'nav.forms', codeKey: 'mod.forms.code', icon: IconForm, group: 'analytics' },
  { to: '/forecast', labelKey: 'nav.forecast', icon: IconBrain, group: 'analytics' },
];
