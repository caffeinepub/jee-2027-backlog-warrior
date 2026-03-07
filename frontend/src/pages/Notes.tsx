import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { useNotes, Note } from '../hooks/useNotes';
import { Plus, Trash2, Edit2, Save, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedNote(null);
    setEditTitle('');
    setEditBody('');
  };

  const handleSaveNew = () => {
    if (!editBody.trim()) {
      toast.error('Note body is required');
      return;
    }
    addNote(editTitle, editBody);
    setIsCreating(false);
    setEditTitle('');
    setEditBody('');
    toast.success('Note created successfully');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
    setEditTitle(note.title);
    setEditBody(note.body);
  };

  const handleEditNote = () => {
    if (selectedNote) {
      setIsEditing(true);
      setEditTitle(selectedNote.title);
      setEditBody(selectedNote.body);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    if (!editBody.trim()) {
      toast.error('Note body is required');
      return;
    }
    updateNote(selectedNote.id, editTitle, editBody);
    setSelectedNote({ ...selectedNote, title: editTitle, body: editBody });
    setIsEditing(false);
    toast.success('Note updated successfully');
  };

  const handleCancelEdit = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditBody(selectedNote.body);
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleDeleteNote = (note: Note) => {
    deleteNote(note.id);
    if (selectedNote?.id === note.id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
    toast.success('Note deleted');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-12rem)]">
        {/* Notes List */}
        <Card className="lg:w-80 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
              <Button size="sm" onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0">
            <ScrollArea className="h-full px-6 pb-6">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs mt-1">Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedNote?.id === note.id ? 'bg-primary/10 border-primary' : 'border-border'
                      }`}
                      onClick={() => handleSelectNote(note)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {note.title || 'Untitled Note'}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {note.body}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDate(note.updatedAt)}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Note Editor/Viewer */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>
                {isCreating ? 'New Note' : isEditing ? 'Edit Note' : selectedNote ? selectedNote.title || 'Untitled Note' : 'Select a note'}
              </CardTitle>
              {selectedNote && !isEditing && !isCreating && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleEditNote}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
              {(isEditing || isCreating) && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={isCreating ? handleSaveNew : handleSaveEdit}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 flex flex-col gap-4">
            {(isEditing || isCreating) ? (
              <>
                <Input
                  placeholder="Note title (optional)"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Write your note here..."
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="flex-1 resize-none"
                />
              </>
            ) : selectedNote ? (
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  {selectedNote.title && (
                    <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(selectedNote.updatedAt)}
                  </p>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedNote.body}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select a note to view or create a new one</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
