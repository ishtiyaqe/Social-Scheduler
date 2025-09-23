import time
import random

# Simulate posting to a platform
def post_to_platform(platform: str, text: str, image_path: str):
    # Add some fake network delay
    time.sleep(random.uniform(0.5, 1.2))
    # Randomly simulate failure
    if random.random() < 0.1:
        return False, f"Simulated {platform} failure"
    return True, f"Posted to {platform} (mock) with image {image_path}"
