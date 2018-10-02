import { ActionMap } from 'constate';
import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Flex, styled } from 'reakit';
import { ComponentProps } from '../types';
import { EditorToolbar } from './EditorToolbar';
import { EditorView } from './EditorView';
import { setFileProblems } from './redux';
import { EditorFile, EditorFiles, FileDiagnostic, TextRange } from './types';

const Wrapper = styled(Flex)`
  align-self: stretch;
  justify-self: stretch;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`;

interface ExternalProps {
  readonly files: EditorFiles;
}

interface State {
  readonly file?: EditorFile;
  readonly range?: TextRange;
}

const INITIAL_STATE: State = {};

interface Actions {
  readonly onSelectFile: (file: EditorFile) => void;
  readonly onSelectRange: (file: EditorFile, range: TextRange) => void;
}

const actions: ActionMap<State, Actions> = {
  onSelectFile: (file: EditorFile) => () => ({
    file,
  }),
  onSelectRange: (file: EditorFile, range: TextRange) => () => ({
    file,
    range,
  }),
};

interface Props extends ExternalProps {
  readonly onChangeProblems: (path: string, diagnostics: ReadonlyArray<FileDiagnostic>) => void;
}

const EditorBase = ({ files, onChangeProblems, ...props }: Props & ComponentProps<typeof Wrapper>) => (
  <Container initialState={{ ...INITIAL_STATE, file: files[0] }} actions={actions}>
    {({ range, file, onSelectFile, onSelectRange }) => (
      <Wrapper {...props}>
        <EditorView
          file={file}
          files={files}
          onSelectFile={onSelectFile}
          onChangeProblems={onChangeProblems}
          range={range}
        />
        <EditorToolbar file={file} files={files} onSelectRange={onSelectRange} />
      </Wrapper>
    )}
  </Container>
);

export const Editor = connect(
  undefined,
  (dispatch) => ({
    // tslint:disable-next-line no-unnecessary-type-annotation
    onChangeProblems: (path: string, diagnostics: ReadonlyArray<FileDiagnostic>) =>
      dispatch(setFileProblems({ path, problems: diagnostics })),
  }),
)(EditorBase);
