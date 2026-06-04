'use client';

import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import { Code, Eye } from 'lucide-react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const Btn = ({ onClick, active, label, title }: { onClick: () => void; active?: boolean; label: React.ReactNode; title?: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-brand-primary/15 text-brand-primary' : 'text-text-muted hover:bg-surface-secondary hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );

  const Divider = () => <div className="mx-0.5 h-5 w-px bg-brand-border/60" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-border/80 bg-surface/80 px-3 py-2">
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label={<strong>B</strong>} title="Bold" />
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label={<em>I</em>} title="Italic" />
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} label={<span className="underline">U</span>} title="Underline" />
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} label={<span className="line-through">S</span>} title="Strikethrough" />
      <Divider />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="H1" title="Heading 1" />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="H2" title="Heading 2" />
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} label="H3" title="Heading 3" />
      <Divider />
      <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} label="L" title="Align left" />
      <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} label="C" title="Align center" />
      <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} label="R" title="Align right" />
      <Divider />
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="•" title="Bullet list" />
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="1." title="Ordered list" />
      <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} label="☑" title="Task list" />
      <Divider />
      <Btn onClick={addLink} active={editor.isActive('link')} label="🔗" title="Add link" />
      <Btn onClick={addImage} label="🖼" title="Add image" />
      <Btn onClick={addTable} label="⊞" title="Insert table" />
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} label="❝" title="Blockquote" />
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} label="<>" title="Code block" />
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} label="—" title="Horizontal rule" />
      <Divider />
      <Btn onClick={() => editor.chain().focus().undo().run()} label="↩" title="Undo" />
      <Btn onClick={() => editor.chain().focus().redo().run()} label="↪" title="Redo" />
    </div>
  );
}

function TableToolbar({ editor }: { editor: Editor }) {
  if (!editor.isActive('table')) return null;

  return (
    <div className="flex items-center gap-1 border-b border-brand-border/60 bg-brand-primary/5 px-3 py-1.5 text-xs">
      <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="rounded px-2 py-1 text-text-muted hover:bg-surface-secondary hover:text-foreground">Add col before</button>
      <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="rounded px-2 py-1 text-text-muted hover:bg-surface-secondary hover:text-foreground">Add col after</button>
      <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="rounded px-2 py-1 text-red-500 hover:bg-red-50">Del col</button>
      <span className="mx-1 h-3 w-px bg-brand-border/60" />
      <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="rounded px-2 py-1 text-text-muted hover:bg-surface-secondary hover:text-foreground">Add row before</button>
      <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="rounded px-2 py-1 text-text-muted hover:bg-surface-secondary hover:text-foreground">Add row after</button>
      <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="rounded px-2 py-1 text-text-muted hover:bg-surface-secondary hover:text-foreground">Del row</button>
      <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="rounded px-2 py-1 text-red-500 hover:bg-red-50">Delete table</button>
    </div>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: placeholder ?? 'Start writing...' }),
      HorizontalRule,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-invert max-w-none focus:outline-none min-h-64 px-4 py-3',
      },
    },
  });

  const toggleSource = useCallback(() => {
    if (!editor) return;
    if (showSource) {
      editor.commands.setContent(sourceHtml);
      onChange(sourceHtml);
    } else {
      setSourceHtml(editor.getHTML());
    }
    setShowSource(!showSource);
  }, [editor, showSource, sourceHtml, onChange]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-input border border-brand-border bg-surface-elevated shadow-sm transition focus-within:border-brand-primary/60 focus-within:ring-2 focus-within:ring-brand-primary/20">
      {showSource ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-brand-border/80 bg-surface/80 px-3 py-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">HTML</span>
            <button
              type="button"
              onClick={toggleSource}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition hover:bg-surface-secondary hover:text-foreground"
              title="Back to visual editor"
            >
              <Eye className="h-3.5 w-3.5" />
              Visual
            </button>
          </div>
          <textarea
            className="min-h-64 w-full border-0 bg-surface-elevated px-4 py-3 font-mono text-sm text-foreground focus:outline-none"
            value={sourceHtml}
            onChange={(e) => {
              setSourceHtml(e.target.value);
              onChange(e.target.value);
            }}
            spellCheck={false}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Toolbar editor={editor} />
            <button
              type="button"
              onClick={toggleSource}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-secondary hover:text-foreground"
              title="Edit HTML source"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>
          <TableToolbar editor={editor} />
          <EditorContent editor={editor} />
        </>
      )}
    </div>
  );
}
