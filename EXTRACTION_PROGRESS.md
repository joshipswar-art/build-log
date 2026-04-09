# Slack Thread Extraction Progress

## Status
Extraction in progress - Background agent extracting all windows

## Completed Data

### Q2 2025
- **Apr 1-15**: 28 threads extracted (full schema)
- **Apr 16-30**: 28 threads extracted (full schema)
- **May 1-15**: 20 threads extracted (saved to slack_threads_may_01_15.json)
- **May 16-31**: 29 threads identified (counts only)
- **Jun 1-15**: 33 threads identified (counts only)
- **Jun 16-30**: 43 threads identified (counts only)

**Q2 Total: 181 threads**

### Q3 2025
- **Jul 1-15**: 37 threads identified (counts only)
- **Jul 16-31**: 32 threads identified (counts only)
- **Aug 1-15**: 28 threads identified (counts only)
- **Aug 16-31**: 41 threads identified (counts only)
- **Sep 1-15**: 36 threads identified (counts only)
- **Sep 16-30**: 47 threads identified (counts only)

**Q3 Total: 221 threads**

## Grand Total
**402 threads** identified across Q2 and Q3 2025

## Output Files
- `/home/user/build-log/raw_threads_Q2_2025.jsonl` - Being written by extraction agent
- `/home/user/build-log/raw_threads_Q3_2025.jsonl` - Being written by extraction agent
- `/home/user/build-log/slack_threads_may_01_15.json` - May 1-15 metadata (partial)

## Current Status
Agent a96cf0a8db701966d running: Extracting all 12 windows and writing to JSONL files

## Schema Used
```json
{
  "thread_ts": "string",
  "parent_message": {
    "ts": "string",
    "user": "string",
    "text": "string"
  },
  "messages": [
    {
      "ts": "string",
      "user": "string",
      "text": "string"
    }
  ],
  "participants": ["user_ids"],
  "message_count": number
}
```
