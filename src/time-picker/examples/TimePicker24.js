class Example extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render = () => {
    const minTime = { hours : 8, minutes: 30 };
    const maxTime = { hours : 18, minutes: 30 };
    return (
      <div>
        <h1>24 Hour Time Picker</h1>
        <TimePicker value={this.state.value} minTime={minTime} maxTime={maxTime} onChange={(value) => this.setState({ value })} timeFormat="24h" />
      </div>
    );
  }
}