import type { Answer, Question } from '../lib/types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selected: Answer;
  flagged: boolean;
  onSelect: (optionId: string) => void;
  onToggleFlag: () => void;
}

export function QuestionCard({
  question,
  index,
  total,
  selected,
  flagged,
  onSelect,
  onToggleFlag,
}: QuestionCardProps) {
  const isMulti = question.type === 'multi';
  const isSelected = (id: string) => selected.includes(id);

  return (
    <div className="question-card">
      <div className="qmeta">
        <div>
          Câu {index + 1} / {total}
          {question.topic && ` · ${question.topic}`}
          {isMulti && ' · Chọn nhiều đáp án'}
        </div>
        <button
          className={`flag-btn ${flagged ? 'flagged' : ''}`}
          onClick={onToggleFlag}
          title="Đánh dấu để xem lại"
        >
          {flagged ? '⚑ Đã flag' : '⚐ Flag'}
        </button>
      </div>

      <div className="prompt">{question.prompt}</div>

      {question.code && <pre className="code">{question.code}</pre>}

      <div className="options-list">
        {question.options.map((opt) => {
          const checked = isSelected(opt.id);
          return (
            <label
              key={opt.id}
              className={`option-row ${checked ? 'selected' : ''}`}
            >
              <input
                type={isMulti ? 'checkbox' : 'radio'}
                name={question.id}
                checked={checked}
                onChange={() => onSelect(opt.id)}
              />
              <span className="option-id">{opt.id.toUpperCase()}.</span>
              <span>{opt.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
