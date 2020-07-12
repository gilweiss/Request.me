import  React from 'react';
import { Link as RouterLink } from 'react-router-dom';


//props
// href
// reactRouter
// className

// reactRouter,
// href,
// children,
// className,

export class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



generateLink = () => {
  if (this.props.reactRouter) {
    return (
      <RouterLink className={this.props.className} to={this.props.href}>
        {this.props.children}
      </RouterLink>
    );
  } else {
    return (
      <a className={this.props.className} href={this.props.href}>
        {this.props.children}
      </a>
    );
  }
};

render() {
  return (
      <div>{this.generateLink()}</div>
  );
  }

  }