import React from 'react';
import Admonition from '@theme/Admonition';

export default () => (
  <Admonition type='caution' icon='🚧' title='Pardon our dust!'>
    We are in the process of updating and expanding our documentation, and
    collapsing the Development FAQ pages into other parts of our documentation
    as part of this process. Some information may be temporarily outdated. If
    something seems wrong, please{' '}
    <a href='https://discord.gg/holdshift'>join our Discord</a> and ask in{' '}
    <code>#plugin-dev</code> for assistance.
  </Admonition>
);
