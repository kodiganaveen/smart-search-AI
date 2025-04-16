# Smart Search AI

Smart Search AI is a React-based application that provides an intelligent search box with voice input capabilities. It allows users to search for information using text or voice commands and displays results in a user-friendly format.

## Features

- **Text Search**: Users can type queries into the search box and retrieve results.
- **Voice Search**: Users can use voice input for hands-free searching.
- **Dynamic Results**: Displays search results dynamically, including titles, descriptions, and optional images.
- **Loading Indicator**: Shows a loading spinner while fetching results.
- **Clear Functionality**: Allows users to clear the search box and results with a single click.

## Technologies Used

- **React**: For building the user interface.
- **Material-UI (MUI)**: For styling and UI components.
- **Speech Recognition API**: For voice input functionality.
- **Fetch API**: For making API requests to the backend.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-search-ai.git
   cd smart-search-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the application in your browser at `http://localhost:3000`.

## Usage

1. **Text Search**:
   - Type your query into the search box.
   - Press the "Enter" key or click the search icon to fetch results.

2. **Voice Search**:
   - Click the microphone icon to start voice input.
   - Speak your query, and the application will automatically process it.

3. **Clear Search**:
   - Click the clear icon to reset the search box and results.

## API Integration

The application sends search queries to the `/api/ai` endpoint using a POST request. The backend should handle the query and return results in the following format:
```json
{
  "results": [
    {
      "title": "Result Title",
      "overview": "Brief description of the result.",
      "poster": "/path/to/image.jpg"
    }
  ]
}
```

## File Structure

- **components/SearchBox.tsx**: Contains the main search box component with text and voice input functionality.
- **public/**: Static assets for the application.
- **src/**: Source code for the React application.

## Future Enhancements

- Add support for multiple languages in voice recognition.
- Improve error handling and user feedback.
- Implement pagination for large result sets.
- Add unit tests for components.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Contact

For questions or feedback, please contact [your-email@example.com].
