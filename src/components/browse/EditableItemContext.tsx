
import React, { createContext, useContext, useEffect, useState } from 'react';

interface EditableItemContextType {
  editItem: any;
  editType: string;
  clearEditItem: () => void;
}

const EditableItemContext = createContext<EditableItemContextType>({
  editItem: null,
  editType: '',
  clearEditItem: () => {}
});

export const useEditableItem = () => useContext(EditableItemContext);

export const EditableItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>('');
  
  useEffect(() => {
    // Get edit data from localStorage if it exists
    const storedItem = localStorage.getItem('editItem');
    const storedType = localStorage.getItem('editType');
    
    if (storedItem) {
      try {
        setEditItem(JSON.parse(storedItem));
        setEditType(storedType || '');
      } catch (error) {
        console.error('Error parsing edit item:', error);
      }
    }
  }, []);
  
  const clearEditItem = () => {
    setEditItem(null);
    setEditType('');
    localStorage.removeItem('editItem');
    localStorage.removeItem('editType');
  };
  
  return (
    <EditableItemContext.Provider value={{ editItem, editType, clearEditItem }}>
      {children}
    </EditableItemContext.Provider>
  );
};
