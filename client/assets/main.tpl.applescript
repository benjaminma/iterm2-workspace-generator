-- ${workspace}.applescript
-- Generated on ${timestamp} using iterm2workspace.com

${colorDefinitions}

${workDefinitions}
${workList}

launch "iTerm"

tell application "iTerm"
  activate
  set myTerm to (make new terminal)
  tell myTerm
    repeat with workChunk in workChunks
      set workTitle to title of workChunk
      set workPath to path of workChunk
      set workCommands to commands of workChunk
      set workBackground to background of workChunk
      set mySession to (launch session "Default")
      tell mySession
        set name to workTitle
        set background color to workBackground
        write text "cd " & workPath & " && " & workCommands
      end tell
    end repeat
  end tell
end tell