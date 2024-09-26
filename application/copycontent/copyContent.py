# collect_project_files.py

import os
import logging

# Setup logging for debugging
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s')

# Path to the copy_content directory (current directory where this script resides)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))  # Directory of the running script

# Root directory is the project root, two levels above the current script directory
APPLICATION_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))  # Path to the application directory

# Path to the .copycontentignore file inside the copycontent directory
copycontentignore_PATH = os.path.join(SCRIPT_DIR, '.copycontentignore')  # Correct location in copycontent folder

# Output file in the same directory as the script, inside the copy_content folder
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'combined_output.txt')

# Function to parse .copycontentignore and get the list of patterns to ignore
def parse_copycontentignore(copycontentignore_path):
    ignore_patterns = []
    logging.debug(f'Reading .copycontentignore file: {copycontentignore_path}')
    
    try:
        with open(copycontentignore_path, 'r') as file:
            for line in file:
                stripped_line = line.strip()
                if stripped_line and not stripped_line.startswith('#'):
                    # Ensure forward slashes for both patterns and paths
                    ignore_patterns.append(stripped_line.replace('\\', '/'))
                    logging.debug(f'Ignoring pattern: {stripped_line}')
    except FileNotFoundError:
        logging.error(f'.copycontentignore file not found: {copycontentignore_path}')
    
    return ignore_patterns

# Function to check if a file or directory should be ignored based on patterns from .copycontentignore
def should_ignore(file_path, ignore_patterns, root_dir):
    # Get the relative path from the root directory and normalize to forward slashes
    relative_path = os.path.relpath(file_path, start=root_dir).replace('\\', '/')

    logging.debug(f'Checking if should ignore: {relative_path}')
    
    # Automatically ignore any path that contains "node_modules" anywhere in the relative path
    if "node_modules" in relative_path.split('/'):
        logging.debug(f'Skipping node_modules directory: {relative_path}')
        return True

    for pattern in ignore_patterns:
        normalized_pattern = pattern.rstrip('/')  # Remove trailing '/' if present for directories
        
        # Match directories by prefix and exact file paths
        if os.path.isdir(file_path) and relative_path.startswith(normalized_pattern):
            logging.debug(f'Skipping ignored directory: {relative_path} (matched pattern: {normalized_pattern})')
            return True
        elif relative_path == normalized_pattern:
            logging.debug(f'Skipping ignored file: {relative_path} (matched pattern: {normalized_pattern})')
            return True

    return False

# Function to read files from the project and write content to an output file
def write_project_files_to_output(application_dir, output_file):
    logging.info(f'Starting to process files in directory: {application_dir}')
    ignore_patterns = parse_copycontentignore(copycontentignore_PATH)
    
    files_to_read = []  # List of files to be read
    
    try:
        # Collect a list of files that will be read, only from the application directory
        for dirpath, dirnames, filenames in os.walk(application_dir):
            logging.debug(f'Walking through directory: {dirpath}')
            
            # Skip ignored directories
            dirnames[:] = [d for d in dirnames if not should_ignore(os.path.join(dirpath, d), ignore_patterns, application_dir)]
            
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                if not should_ignore(file_path, ignore_patterns, application_dir):
                    files_to_read.append(file_path)  # Add to the list of files to read

        # Print the list of files to be read before starting to read them
        logging.info("List of files to be read:")
        for file in files_to_read:
            logging.info(file)

        # Now proceed to read and write the files
        with open(output_file, 'w') as output:
            for file_path in files_to_read:
                logging.debug(f'Reading file: {file_path}')
                try:
                    # Read the file as text and write to the output file
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                        content = file.read()
                        output.write(f'File: {file_path}\n\n')
                        output.write(content)
                        output.write('\n\n' + ('='*80) + '\n\n')  # Separator between file contents
                except Exception as e:
                    logging.error(f'Error reading file: {file_path}. Error: {e}')
                        
        logging.info(f"All readable file contents have been written to {output_file}.")
    except Exception as e:
        logging.error(f'Error writing to output file: {output_file}. Error: {e}')

# Run the function
if __name__ == "__main__":
    write_project_files_to_output(APPLICATION_DIR, OUTPUT_FILE)
