# GoogleDriveAPI
Express JS and Node JS code to use Google Drive APIs
// Initialize counters
int a = 0;
int b = 0;
int c = 0;

// Read the CSV file
var lines = File.ReadAllLines("path_to_your_csv_file.csv");

// Skip the header row by starting with index 1 (if the CSV has a header)
for (int i = 1; i < lines.Length; i++)
{
    // Split the line into cells
    var cells = lines[i].Split(',');

    // Assuming that the status text is in the first cell (index 0)
    var cellValueStatus = cells[0].Trim().ToLower();

    // Assuming the input value is in the second cell (index 1)
    var cellValueInput = cells[1].Trim().ToLower();

    // Increment the appropriate counter based on the cell content
    if (cellValueStatus == excelCella.ToLower() && cellValueInput == excelCell.ToLower())
    {
        a++;
    }
    else if (cellValueStatus == excelCellb.ToLower() && cellValueInput == excelCell.ToLower())
    {
        b++;
    }
    else if (cellValueStatus == excelCellc.ToLower() && cellValueInput == excelCell.ToLower())
    {
        c++;
    }
}

// Your counts are now in variables a, b, c
Console.WriteLine($"Count A: {a}");
Console.WriteLine($"Count B: {b}");
Console.WriteLine($"Count C: {c}");
