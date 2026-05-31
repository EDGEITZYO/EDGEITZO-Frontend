import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { type BookmarkFolder } from '../../types/saved';

// TODO: API 연동 시 실제 폴더 목록으로 교체
const MOCK_FOLDERS: BookmarkFolder[] = [
  { id: '1', name: '전체', keywords: [], paperCount: 12, updatedAt: '2달 전', isDefault: true },
  { id: '2', name: '생명', keywords: ['유전', '세포'], paperCount: 5, updatedAt: '1달 전', isDefault: false },
  { id: '3', name: '공학', keywords: ['유전자'], paperCount: 3, updatedAt: '3주 전', isDefault: false },
];

interface BookmarkFolderSelectDialogProps {
  open: boolean;
  onClose: () => void;
  paperId: string;
}

const BookmarkFolderSelectDialog = ({
  open,
  onClose,
  paperId,
}: BookmarkFolderSelectDialogProps) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFolderSelect = (folder: BookmarkFolder) => {
    // TODO: API 연동 시 북마크 추가 처리
    console.log('북마크 추가', paperId, folder.id);
    setSnackbarMessage('북마크에 추가되었습니다');
    setSnackbarOpen(true);
    onClose();
  };

  const handleAddFolder = () => {
    // TODO: 폴더 생성 다이얼로그 연결
    console.log('폴더 추가하기');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              minWidth: '320px',
              maxWidth: '400px',
              width: '100%',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant="h5" sx={{ color: 'label.strong' }}>
            폴더 선택
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MOCK_FOLDERS.map((folder) => (
              <Box
                key={folder.id}
                onClick={() => handleFolderSelect(folder)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'fill.normal' },
                }}
              >
                <FolderOutlinedIcon sx={{ fontSize: '20px', color: 'label.alternative' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ color: 'label.strong', fontWeight: 500 }}>
                    {folder.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'label.alternative' }}>
                    {folder.paperCount}개
                  </Typography>
                </Box>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddFolder}
              sx={{
                justifyContent: 'flex-start',
                padding: '12px 16px',
                borderRadius: '10px',
                color: 'label.alternative',
                '&:hover': { backgroundColor: 'fill.normal' },
              }}
            >
              폴더 추가하기
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default BookmarkFolderSelectDialog;