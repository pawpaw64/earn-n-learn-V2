
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface PollCreatorProps {
  onCreatePoll: (pollData: { question: string; options: string[] }) => void;
  onCancel: () => void;
}

export function PollCreator({ onCreatePoll, onCancel }: PollCreatorProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    const validOptions = options.filter(opt => opt.trim());
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll({
        question: question.trim(),
        options: validOptions
      });
    }
  };

  const isValid = question.trim() && options.filter(opt => opt.trim()).length >= 2;

  return (
    <Card className="w-full max-w-md mx-auto bg-white border border-gray-200">
      <CardHeader className="bg-emerald-600 text-white rounded-t-lg">
        <CardTitle className="text-lg text-center">Create Poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <Input
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
        />
        
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
              {options.length > 2 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  className="flex-shrink-0 text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {options.length < 10 && (
          <Button
            variant="outline"
            onClick={addOption}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 bg-emerald-600 hover:bg-gray-800 disabled:bg-gray-400 text-white"
          >
            Create Poll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
