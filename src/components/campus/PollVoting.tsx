
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Vote } from 'lucide-react';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface PollVotingProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasUserVoted: boolean;
  userVote?: number;
  onVote: (optionId: number) => void;
}

export function PollVoting({ 
  question, 
  options, 
  totalVotes, 
  hasUserVoted, 
  userVote, 
  onVote 
}: PollVotingProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleVote = () => {
    if (selectedOption && !hasUserVoted) {
      onVote(parseInt(selectedOption));
    }
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Question Header */}
      <div className="bg-black text-white px-4 py-3 text-center">
        <h3 className="font-semibold text-sm uppercase tracking-wide">{question} 👆</h3>
      </div>

      <div className="p-4">
        {!hasUserVoted ? (
          // Voting interface
          <div className="space-y-3">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={option.id.toString()}
                    className="border-gray-400"
                  />
                  <Label
                    htmlFor={option.id.toString()}
                    className="flex-1 text-gray-800 cursor-pointer py-2 px-3 rounded border border-gray-200 hover:bg-gray-50"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button
              onClick={handleVote}
              disabled={!selectedOption}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white"
            >
              <Vote className="h-4 w-4 mr-2" />
              Vote
            </Button>
          </div>
        ) : (
          // Results interface
          <div className="space-y-3">
            {options.map((option) => {
              const percentage = getPercentage(option.votes);
              const isUserChoice = userVote === option.id;
              
              return (
                <div key={option.id} className="relative">
                  <div className="flex items-center justify-between bg-gray-100 rounded overflow-hidden">
                    <div 
                      className={`flex items-center justify-between w-full px-4 py-3 relative z-10 ${
                        isUserChoice ? 'text-white' : 'text-black'
                      }`}
                    >
                      <span className="font-medium">{option.text}</span>
                      <span className="font-bold text-lg">{percentage}%</span>
                    </div>
                    <div
                      className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                        isUserChoice ? 'bg-black' : 'bg-gray-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            <div className="text-center text-sm text-gray-600 pt-2">
              Total votes: {totalVotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
