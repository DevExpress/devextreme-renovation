import { Identifier, BaseClassMember } from '@devextreme-generator/core';

export function getEventName(
  defaultName: Identifier | string,
  stateMembers?: Array<BaseClassMember>,
) {
  const state = stateMembers?.find(
    (s) => `${s._name}Change` === defaultName.toString(),
  );
  const eventName = state ? `update:${state._name}` : defaultName;

  let eventParts = eventName
    .toString()
    .split(/(?=[A-Z])/)
    .map((w) => w.toLowerCase());
  if (eventParts[0] === 'on') {
    eventParts = eventParts.slice(1);
  }

  return eventParts.join('-');
}
