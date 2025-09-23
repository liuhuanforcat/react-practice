import './App.css'
import RouterWrapper from './routers/RouterWrapper';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    
    <ErrorBoundary>
      <RouterWrapper />
    </ErrorBoundary>
  )
}

export default App
