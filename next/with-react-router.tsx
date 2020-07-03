import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router';
const isServer = typeof window === 'undefined';

export default App => {
  return class AppWithReactRouter extends React.Component<any, any> {
    static async getInitialProps(appContext: any) {
      const {
        ctx: {
          req: {
            originalUrl,
            locals = {},
          },
        },
      } = appContext;
      return {
        originalUrl,
        context: locals.context || {},
      };
    }

    render() {
      if (isServer) {
        return (
          <StaticRouter
            location={this.props.originalUrl}
            context={this.props.context}
          >
            <App {...this.props} />
          </StaticRouter>
        );
      }
      return (
        <BrowserRouter>
          <App {...this.props} />
        </BrowserRouter>
      );
    }
  };
};