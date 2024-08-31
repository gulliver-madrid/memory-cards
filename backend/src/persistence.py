import json
import os

from src.model import User

# Get the path of the 'backend' directory
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Full path to the 'data' directory within 'backend'
data_dir = os.path.join(backend_dir, 'data')

# Create the 'data' directory if it does not exist
if not os.path.exists(data_dir):
    os.makedirs(data_dir)


USERS_FILE = 'data/users.json'


def load_users_from_file() -> list[User]:
    """Load users from a JSON file."""
    try:
        with open(USERS_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as err:
        raise RuntimeError('Error loading the json file') from err

def save_users_to_file(users: list[User]) -> None:
    """Save users to a JSON file."""
    with open(USERS_FILE, 'w') as file:
        json.dump(users, file, indent=4)