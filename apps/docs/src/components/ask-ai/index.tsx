'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MUITextField from '@nish1896/mui-components/mui/textfield';
import type { Citation } from '@/app/api/answer/route';
import type { ExternalLink } from '@/lib/rag/muiLinks';
import { renderInlineMd, renderAnswerBlocks } from '@/utils/inline-markdown';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  externalLinks?: ExternalLink[];
};

const ASK_AI_TOOLTIP = 'Ask AI about these docs';

const TypingDots = () => (
  <Stack
    direction="row"
    sx={{
      alignSelf: 'flex-start',
      gap: 0.5,
      px: 1.5,
      py: 1.4
    }}
  >
    {[0, 1, 2].map(i => (
      <Box
        key={i}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'text.secondary',
          animation: 'askAiTypingBounce 1.2s infinite ease-in-out',
          animationDelay: `${i * 0.2}s`,
          '@keyframes askAiTypingBounce': {
            '0%, 80%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
            '40%': { opacity: 1, transform: 'scale(1)' }
          }
        }}
      />
    ))}
  </Stack>
);

/**
 * Sitewide "Ask AI" widget: a bottom-right FAB that opens a scrollable chat
 * panel backed by `/api/answer` (retrieval + grounded synthesis, step 4).
 */
const AskAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    });
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) {
      return;
    }

    setMessages(prev => [
      ...prev,
      { role: 'user', content: question }
    ]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        res.ok
          ? {
            role: 'assistant',
            content: data.answer,
            citations: data.citations,
            externalLinks: data.externalLinks
          }
          : {
            role: 'assistant',
            content: data.error ?? 'Something went wrong asking that — try again.'
          }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong asking that — try again.'
        }
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <>
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            height: 520,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 1300
          }}
        >
          <Stack
            direction="row"
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                gap: 1
              }}
            >
              <AutoAwesomeIcon color="primary" fontSize="small" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}
              >
                Ask AI
              </Typography>
              <Chip
                label="Beta"
                size="small"
                color="secondary"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 700
                }}
              />
            </Stack>
            <IconButton
              size="small"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            {messages.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {renderInlineMd(
                  'Ask anything about the MUI Components docs — e.g. "**Does `MUINumberInput` support `renderValue`?**"'
                )}
              </Typography>
            )}
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1
                }}
              >
                {msg.role === 'assistant'
                  ? (
                    <Box sx={{ typography: 'body2' }}>
                      {renderAnswerBlocks(msg.content)}
                    </Box>
                  )
                  : (
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {msg.content}
                    </Typography>
                  )}
                {!!msg.citations?.length && (
                  <Stack sx={{ mt: 1, gap: 0.5 }}>
                    {msg.citations.map((c, ci) => (
                      <Link
                        key={ci}
                        href={c.anchor ? `${c.pageUrl}#${c.anchor}` : c.pageUrl}
                        style={{
                          fontSize: 12,
                          textDecoration: 'underline'
                        }}
                      >
                        {(c.componentName ? `${c.componentName} — ` : '') + c.sectionHeading}
                      </Link>
                    ))}
                  </Stack>
                )}
                {!!msg.externalLinks?.length && (
                  <Stack sx={{ mt: 1, gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">MUI docs:</Typography>
                    {msg.externalLinks.map((link, li) => (
                      <MuiLink
                        key={li}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ fontSize: 12 }}
                      >
                        {link.label}
                        <Box
                          component="span"
                          sx={{
                            textDecoration: 'none',
                            display: 'inline-block',
                            ml: 0.5,
                            fontSize: 10
                          }}
                        >
                          ↗
                        </Box>
                      </MuiLink>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
            {loading && <TypingDots />}
          </Box>

          <Stack
            direction="row"
            sx={{
              p: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              gap: 1
            }}
          >
            <MUITextField
              fieldName="user-question"
              value={input}
              onValueChange={({ newValue }) => setInput(newValue)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              size="small"
              fullWidth
              hideLabel
              placeholder="Ask a question..."
            />
            <IconButton
              color="primary"
              aria-label="Send question"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Paper>
      )}

      <Fab
        color="primary"
        aria-label={ASK_AI_TOOLTIP}
        title={ASK_AI_TOOLTIP}
        onClick={() => setOpen(prev => !prev)}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}
      >
        {open ? <CloseIcon /> : <AutoAwesomeIcon />}
      </Fab>
    </>
  );
};

export default AskAI;
