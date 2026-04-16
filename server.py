from flask import Flask, jsonify
import requests
import pandas as pd
from datetime import datetime, timedelta

app = Flask(__name__)

# Football-Data.org API configuration
API_KEY = "b881fab751be43f8aff7bd21a44aef2d"
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
            return standings
        else:
            print(f"Error: {response.status_code}")
            return None

@app.route('/api/standings', methods=['GET'])
def get_standings():
    """API endpoint to get Premier League standings"""
    try:
        analyzer = FootballAnalyzer(API_KEY)
        standings = analyzer.get_standings("PL")
        
        if standings:
            # Convert to list of dicts for JSON
            standings_list = []
            for team in standings:
                standings_list.append({
                    "position": team["position"],
                    "team": {
                        "name": team["team"]["name"]
                    },
                    "playedGames": team["playedGames"],
                    "won": team["won"],
                    "draw": team["draw"],
                    "lost": team["lost"],
                    "goalsFor": team["goalsFor"],
                    "goalsAgainst": team["goalsAgainst"],
                    "points": team["points"]
                })
            
            return jsonify({
                "success": True,
                "standings": standings_list
            })
        else:
            return jsonify({
                "success": False,
                "error": "Failed to fetch standings from API"
            }), 500
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    print("Starting Football Data Server...")
    print("Server running at http://localhost:5000")
    print("API endpoint: http://localhost:5000/api/standings")
    app.run(debug=True, port=5000)
