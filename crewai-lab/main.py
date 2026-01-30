import sys
import json
from crew import GrowthCrew

def run():
    print("## Welcome to the Cleaning Business Domination Lab ##")
    
    inputs = {
        'company_name': 'The Valley Clean Team',
        'website_url': 'gamma.thevalleycleanteam.com',
        'location': 'North Alabama & West Nashville',
        'context': 'We use Booking Koala. We have a specific Flat Rate Pricing model (JSON available) and a "Cost Plus" model for recurring services.'
    }
    
    print(f"Analyzing strategy for: {inputs['company_name']}...")
    
    try:
        GrowthCrew().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

if __name__ == "__main__":
    run()
