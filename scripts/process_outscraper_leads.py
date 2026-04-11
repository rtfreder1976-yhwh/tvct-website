import pandas as pd
import os
import glob

# Files to process
csv_files = [
    "Outscraper-20260408185302m67_medical_clinic_+2.csv",
    "Outscraper-20260408185422m01_dialysis_center_+2.csv",
    "Outscraper-20260408192802m8e_church (1).csv"
]

all_leads = []

for file in csv_files:
    if not os.path.exists(file):
        print(f"File not found: {file}")
        continue
    
    print(f"Processing {file}...")
    try:
        # Outscraper CSVs can sometimes have encoding issues or multi-line strings
        df = pd.read_csv(file, low_memory=False)
        
        # Check if email column exists
        if 'email' not in df.columns:
            print(f"No 'email' column in {file}")
            continue
            
        # Filter for rows with emails
        df_emails = df[df['email'].notna() & (df['email'] != '')].copy()
        
        # Determine niche from filename or category column
        if "church" in file.lower():
            niche = "Church"
        elif "dialysis" in file.lower():
            niche = "Dialysis Center"
        elif "medical_clinic" in file.lower():
            niche = "Medical Clinic"
        else:
            niche = "Uncategorized"
            
        # Select and rename columns
        subset = pd.DataFrame()
        subset['Name'] = df_emails['name']
        subset['Email'] = df_emails['email']
        subset['Phone'] = df_emails['phone']
        subset['Niche'] = niche
        
        all_leads.append(subset)
    except Exception as e:
        print(f"Error processing {file}: {e}")

if all_leads:
    master_df = pd.concat(all_leads, ignore_index=True)
    
    # Deduplicate by Email
    initial_count = len(master_df)
    master_df.drop_duplicates(subset=['Email'], keep='first', inplace=True)
    final_count = len(master_df)
    
    print(f"Combined {initial_count} leads. Deduplicated down to {final_count} unique emails.")
    
    # Save to CSV
    master_df.to_csv("master_outreach_list.csv", index=False)
    print("Saved to master_outreach_list.csv")
else:
    print("No leads found with emails.")
