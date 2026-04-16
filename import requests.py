import requests
import pandas as pd
from datetime import datetime, timedelta

# Football-Data.org API configuration
API_KEY = "your_api_key_here"
BASE_URL = "https://api.football-data.org/v4"

class FootballAnalyzer:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {"X-Auth-Token": api_key}
    
    def get_standings(self, league_id="PL"):
        """Fetch current league standings"""
        url = f"{BASE_URL}/competitions/{league_id}/standings"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            data = response.json()
            standings = data['standings'][0]['table']
            df = pd.DataFrame([{
                'Position': team['position'],
                'Team': team['team']['name'],
                'Played': team['playedGames'],
                'Wins': team['won'],
                'Draws': team['draw'],
                'Losses': team['lost'],
                'Points': team['points'],
                'GF': team['goalsDifference']
            } for team in standings])
            return df
        else:
            print(f"Error: {response.status_code}")
            return None
    
    def get_matches(self, league_id="PL", days=7):
        """Fetch upcoming matches for the next N days"""
        today = datetime.now().date()
        future = today + timedelta(days=days)
        
        url = f"{BASE_URL}/competitions/{league_id}/matches"
        params = {
            "dateFrom": str(today),
            "dateTo": str(future),
            "status": "SCHEDULED"
        }
        response = requests.get(url, headers=self.headers, params=params)
        
        if response.status_code == 200:
            matches = response.json()['matches']
            df = pd.DataFrame([{
                'Date': match['utcDate'],
                'Home': match['homeTeam']['name'],
                'Away': match['awayTeam']['name'],
                'Status': match['status']
            } for match in matches])
            return df
        else:
            print(f"Error: {response.status_code}")
            return None
    
    def get_team_info(self, team_id):
        """Fetch detailed team information"""
        url = f"{BASE_URL}/teams/{team_id}"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None

# Main execution
if __name__ == "__main__":
    analyzer = FootballAnalyzer(API_KEY)
    
    print("=== Premier League Standings ===")
    standings = analyzer.get_standings("PL")
    if standings is not None:
        print(standings.to_string(index=False))
    
    print("\n=== Upcoming Matches (Next 7 Days) ===")
    matches = analyzer.get_matches("PL", days=7)
    if matches is not None:
        print(matches.to_string(index=False))
