import { Component } from "react";
import ErrorIndicator from "../error-indicator";

const withErrorBoundary = (View) => {
  return class extends Component {
    state = {
      hasError: false,
    };

    componentDidCatch(error, info) {
      this.setState({ hasError: true, error, info });
    }

    render() {
      if (this.state.hasError) {
        return <ErrorIndicator />;
      }

      return <View {...this.props} />;
    }
  };
};

export default withErrorBoundary;
