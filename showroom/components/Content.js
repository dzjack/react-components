import React from 'react';
import _axios from 'axios';
import { find } from 'lodash';
import { props, t } from 'tcomb-react';
import KitchenSink from '../../src/kitchen-sink';

@props({
  router: t.Function,
  query: t.Object,
  params: t.Object,
  sections: t.Array,
  section: t.Object,
  scope: t.Object,
  onSelectItem: t.Function
})
export default class Content extends React.Component {

  constructor(props) {
    super(props);
    this.axios = _axios.create({ baseURL: 'https://rawgit.com/buildo' });
    this.state = { loading: true };
  }

  componentDidMount() {
    this.loadContent();
  }

  loadContent = (props = this.props) => {
    const { params: { sectionId, contentId }, section, sections } = props;
    const contentInfo = find(section.contents, { id: contentId });
    this.axios.get(contentInfo.content)
      .then(res => {
        const content = res.data;
        console.log(content);
        const contents = section.contents.map(c => c.id === contentId ? { ...c, content } : c);
        const mappedSections = sections.map(s => s.id === sectionId ? { ...s, contents } : s);
        this.setState({ sections: mappedSections, loading: false });
      })
  }

  render() {
    const { sections: mappedSections = this.props.sections, loading } = this.state;
    const { params: { sectionId, contentId }, onSelectItem, scope, sections: propSections } = this.props;
    const sections = mappedSections || propSections;

    return <KitchenSink {...{ sections, sectionId, contentId, onSelectItem, scope }} />;
  }

  componentWillReceiveProps(nextProps) {
    const { params: { contentId, sectionId } } = nextProps;
    if (contentId !== this.props.params.contentId || sectionId !== this.props.params.sectionId) {
      // resetState
      this.state = { loading: true };
      this.forceUpdate();

      this.loadContent();
    }
  }

}
