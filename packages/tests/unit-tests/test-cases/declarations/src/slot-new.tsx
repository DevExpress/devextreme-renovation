export function SlotsWidget(viewModel: { 
  id?: string, 
  children: JSX.Element
 }) {
  return (
    <div 
      id={viewModel.id}>
      {viewModel.children}
    </div>
  );
}
