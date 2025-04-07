import logging
import os

import streamlit as st
from dotenv import load_dotenv
from streamlit_theme import st_theme

# Load environment variables
load_dotenv(".env.local")

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.formatter = logging.Formatter(fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger.addHandler(handler)

def initialize_session_state() -> None:
    """Initialize the session state variables if they are not already set."""
    env_vars = {
        # "FOO": "FOO",
        # "BAR": "BAR",
    }
    for var, env in env_vars.items():
        if var not in st.session_state:
            value = os.getenv(env)
            if value is None:
                message = "Missing env variable: " + env
                logger.exception(message)
                # raise ValueError(message)
            st.session_state[var] = value

# Initialize the session state variables
initialize_session_state()

# Set the page layout to wide
st.set_page_config(
    page_title="Snippets",
    page_icon="🍲",
    layout="wide",
)

theme = st_theme()
if theme and theme.get("base") == "dark":
    st.logo(
        image="media/Smiley.svg.png",
        # size="medium",
        link="https://en.wikipedia.org/wiki/Smiley",
    )

# Main Streamlit app starts here

# Header
with st.container():
    col1, col2 = st.columns([250, 800])
    col1.image("media/Smiley.svg.png", width=10)
    col2.write("Picture-to-Palatable (PtP) 📸➡🍲")
    col2.write("AI-Powered Home Cooking Assistant")
    col2.code("v0.0.1")

# Side panel navigation
pg = st.navigation(
    pages=[
        st.Page("components/recommend.py", title="Cook", icon="🧑‍🍳", default=True),
        st.Page("components/profile.py", title="Profile", icon="👤"),
        st.Page("components/ingredients.py", title="Ingredients", icon="🥫"),
        st.Page("components/equipment.py", title="Equipment", icon="🍳"),
        st.Page("components/repices.py", title="Fav Recipes", icon="🍲"),
        st.Page("components/shop.py", title="Shop", icon="🛒"),
    ],
    position="sidebar",
    # expanded=False,
)

# Custom CSS
css = """
<style>
    .stTabs [data-baseweb="tab-list"] button [data-testid="stMarkdownContainer"] p {
    font-size:1.5rem;
    }
</style>
"""

st.markdown(css, unsafe_allow_html=True)

pg.run()
