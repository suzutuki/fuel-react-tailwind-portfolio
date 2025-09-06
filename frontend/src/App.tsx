import React from 'react';
import Home from './components/Home';
import { Button } from '@/components/ui/button';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">shadcn/ui テスト</h1>
        <Button variant="default" size="default">
          shadcn/ui Button
        </Button>
        <Button variant="secondary" className="ml-2">
          Secondary Button
        </Button>
      </div>
      <Home />
    </div>
  );
};

export default App;