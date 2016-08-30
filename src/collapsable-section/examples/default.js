class Example extends React.Component {

  constructor() {
    super();
    this.state = { isOpen: false };
  }

  onChange = (isOpen) => this.setState({ isOpen });

  getHeader = () => (
    <FlexView height={40} vAlignContent='center'>
      <Icon icon='user' />
      <FlexView marginLeft={10}>User</FlexView>
    </FlexView>
  );

  render = () => (
    <CollapsableSection
      isOpen={this.state.isOpen}
      onChange={this.onChange}
      header={this.getHeader()}
      icons={{ open: 'angle-up', closed: 'angle-down' }}
    >
      <div>ITEM 1</div>
      <div>ITEM 2</div>
      <div>ITEM 3</div>
    </CollapsableSection>
  );

}