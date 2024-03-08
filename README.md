# GoogleDriveAPI
Express JS and Node JS code to use Google Drive APIs

public static FileDateAndName GetMostRecentFile(string doctype, string directoryPath, log4net.ILog log)
{
    // Check if the directory exists
    if (!Directory.Exists(directoryPath))
    {
        log.Info($"The directory {directoryPath} does not exist.");
        return null; // Return null immediately if the directory does not exist
    }

    // Get all files matching the pattern "doctype_*.xlsx"
    var files = Directory.GetFiles(directoryPath, doctype + "_*.xlsx");

    // Use LINQ to select the file with the latest date in the filename
    var mostRecentFile = files
        .Select(file => new
        {
            FileName = file,
            // Assuming the date is always immediately after "doctype_" and is 8 characters long
            Date = DateTime.TryParseExact(Path.GetFileNameWithoutExtension(file).Substring(doctype.Length + 1, 8), "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fileDate) ? fileDate : (DateTime?)null
        })
        .Where(f => f.Date != null) // Exclude files where the date could not be parsed
        .OrderByDescending(f => f.Date) // Order by date descending
        .FirstOrDefault(); // Take the most recent file

    if (mostRecentFile == null)
    {
        log.Info("No files found matching the pattern.");
        return null; // Return null if no files are found
    }

    FileDateAndName fileToBeReturned = new FileDateAndName
    {
        FileName = mostRecentFile.FileName,
        FileDate = mostRecentFile.Date?.ToString("yyyy-MM-dd")
    };

    // If there's a file, return its full path, otherwise return null
    return fileToBeReturned;
}

