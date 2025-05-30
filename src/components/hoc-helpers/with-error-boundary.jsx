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
        return <ErrorIndicator message={<button className="btn-danger">Что-то пошло не так...</button>} />;
      }

      return <View {...this.props} />;
    }
  };
};

export default withErrorBoundary;
