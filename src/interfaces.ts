export interface IFile {
  name: string;
  content: string;
}

export interface IConstantMap {
  [key: string]: string[];
}

// export class <name> extends React.Component<{
//   [x: string]: any;
//   style?: React.CSSProperties;
//   <content>
// }> {
//   <bodyContent>
// }
export interface IComponent {
  name: string;
  displayName: string; // used to create index in parent component
  content: string;
  bodyContent: string;
}
