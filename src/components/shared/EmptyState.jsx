import { useNavigate } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionPath }) {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20">
      {Icon && <Icon size={48} className="text-zinc-700 mx-auto mb-4" />}
      <h3 className="font-heading font-semibold text-xl text-zinc-400 mb-2">{title}</h3>
      {description && <p className="text-zinc-500 text-sm mb-6">{description}</p>}
      {actionLabel && actionPath && (
        <button onClick={() => navigate(actionPath)} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
