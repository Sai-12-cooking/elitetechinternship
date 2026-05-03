import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import argparse
import os

def extract_data(file_path):
    """Extracts data from a CSV file."""
    try:
        data = pd.read_csv(file_path)
        print("Data extraction successful.")
        return data
    except Exception as e:
        print(f"Error during extraction: {e}")
        return None

def transform_data(df):
    """
    Performs preprocessing and transformation:
    - Handles missing values
    - Encodes categorical variables
    - Scales numerical features
    """
    # 1. Handle Missing Values
    imputer = SimpleImputer(strategy='mean')
    # Assuming numerical columns for simplicity; adjust as needed
    num_cols = df.select_dtypes(include=['float64', 'int64']).columns
    df[num_cols] = imputer.fit_transform(df[num_cols])

    # 2. Categorical Encoding
    le = LabelEncoder()
    cat_cols = df.select_dtypes(include=['object']).columns
    for col in cat_cols:
        df[col] = le.fit_transform(df[col].astype(str))

    # 3. Feature Scaling
    scaler = StandardScaler()
    df[num_cols] = scaler.fit_transform(df[num_cols])
    
    print("Data transformation complete.")
    return df

def load_data(df, output_path):
    """Loads the transformed data into a new CSV file."""
    try:
        df.to_csv(output_path, index=False)
        print(f"Transformed data saved to: {output_path}")
    except Exception as e:
        print(f"Error during loading: {e}")

def generate_sample_data(file_path):
    """Generates sample data if input file doesn't exist."""
    data = {
        'age': [25, 30, None, 45, 50],
        'salary': [50000, 60000, 70000, None, 90000],
        'department': ['HR', 'IT', 'Finance', 'IT', 'HR'],
        'experience': [2, 5, 8, 10, None]
    }
    df = pd.DataFrame(data)
    df.to_csv(file_path, index=False)
    print(f"Sample data generated and saved to: {file_path}")
    return df

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ETL Pipeline for Data Preprocessing')
    parser.add_argument('--input', default='dataset.csv', help='Input CSV file path')
    parser.add_argument('--output', default='transformed_data.csv', help='Output CSV file path')
    args = parser.parse_args()

    INPUT_FILE = args.input
    OUTPUT_FILE = args.output

    # Generate sample data if input file doesn't exist
    if not os.path.exists(INPUT_FILE):
        print(f"Input file '{INPUT_FILE}' not found. Generating sample data...")
        generate_sample_data(INPUT_FILE)

    # Execute Pipeline
    raw_data = extract_data(INPUT_FILE)
    if raw_data is not None:
        processed_data = transform_data(raw_data)
        load_data(processed_data, OUTPUT_FILE)