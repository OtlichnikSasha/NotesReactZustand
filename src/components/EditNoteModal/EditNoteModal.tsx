import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { Input } from '../UI/Input/Input';
import { Button } from '../UI/Button/Button';
import { Editor } from '@tinymce/tinymce-react';
import { useNotesStore } from '@/store/notesStore';
import { enqueueSnackbar } from 'notistack';
import styles from './EditNoteModal.module.scss';
import { NoteModalHeader } from '../NoteModalHeader/NoteModalHeader';
import { init } from '../UI/TinyEditor/TinyEditor.constants';
import { useModalStore } from '@/store/modalStore';
import { countSymbolHelper } from '@/helpers/countSymbol.helper';
import { Skeleton } from '../UI/Skeleton/Skeleton';

interface IEditNoteProps {
  note: NoteModel;
}

type NoteForm = Pick<NoteModel, 'name' | 'noteText'>;

export const EditNoteModal: FC<IEditNoteProps> = ({ note }) => {
  const tinyEditorRef = useRef<Editor['editor'] | null>(null);
  const [isLoadingTinyEditor, setIsLoadingTinyEditor] = useState<boolean>(true);
  const [noteForm, setNoteForm] = useState<NoteForm>({
    name: note.name,
    noteText: note.noteText,
  });
  const editNote = useNotesStore((state) => state.editNote);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length < 50) setNoteForm({ ...noteForm, name: e.target.value });
  };

  const handleChangeEditor = (): void => {
    setNoteForm({ ...noteForm, noteText: tinyEditorRef?.current?.getContent() || '' });
  };

  const handleEditNote = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    editNote({
      ...note,
      name: noteForm.name,
      noteText: tinyEditorRef?.current?.getContent() || '',
    });
    enqueueSnackbar('Заметка успешно отредактирована', {
      variant: 'success',
    });
    closeModal();
  };

  return (
    <form className={styles.modal} onSubmit={handleEditNote}>
      <div className={styles.modal__form}>
        <div>
          <Input placeholder='Заголовок' value={noteForm.name} onChange={handleInputChange} />
          <NoteModalHeader
            date={note.updatedAt}
            symbolCount={countSymbolHelper(noteForm.name, noteForm.noteText)}
          />
        </div>
        {isLoadingTinyEditor && <Skeleton className={styles.editorSkeleton} />}
        <Editor
          onInit={(_, editor) => {
            setIsLoadingTinyEditor(false);
            return (tinyEditorRef.current = editor);
          }}
          apiKey='uhism6wemykf6usdjyyz0gmfizgyzfedys7f7xnfwi5jkk3k'
          onChange={handleChangeEditor}
          initialValue={note.noteText}
          init={init}
        />
      </div>

      <Button
        disabled={
          (note.name === noteForm.name && note.noteText === noteForm.noteText) || !noteForm?.name
        }
        type='submit'
      >
        Сохранить изменения
      </Button>
    </form>
  );
};
