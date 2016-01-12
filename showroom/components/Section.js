import React from 'react';
import { props, t } from 'tcomb-react';
import { find } from 'lodash';
import Content from './Content';
import Component from './Component';

@props({
  router: t.Function,
  query: t.Object,
  params: t.Object,
  sections: t.Array,
  scope: t.Object,
  onSelectItem: t.Function
})
export default class Section extends React.Component {

  render() {
    const { params: { sectionId }, sections } = this.props;
    const section = find(sections, { id: sectionId });
    const Children = section.contents ? Content : Component;
    console.log(Children);
    return <Children {...this.props} section={section} />;
  }

}
