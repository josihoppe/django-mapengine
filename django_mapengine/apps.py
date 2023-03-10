"""Config for django app"""

import json
import pathlib

import environ
from appconf import AppConf
from django.conf import settings

from . import choropleth

env = environ.Env()


class MapEngineConf(AppConf):
    """Config for django-mapengine app"""

    default_auto_field = "django.db.models.BigAutoField"
    name = "django_mapengine"

    # If given, use local PROJ_LIB environment variable
    if env("PROJ_LIB", default=False):
        PROJ_LIB = env("PROJ_LIB")

    DISTILL = env.bool("DISTILL", False)
    USE_DISTILLED_MVTS = env.bool("USE_DISTILLED_MVTS", True)

    TILING_SERVICE_TOKEN = env.str("TILING_SERVICE_TOKEN", default=None)
    TILING_SERVICE_STYLE_ID = env.str("TILING_SERVICE_STYLE_ID", default=None)

    # STYLES
    if not hasattr(settings, "MAP_ENGINE_STYLES_FOLDER"):
        raise RuntimeError("'MAP_ENGINE_STYLES_FOLDER' has to be set for django-mapengine.")
    MAP_ENGINE_CHOROPLETHS = choropleth.Choropleth(pathlib.Path(settings.MAP_ENGINE_STYLES_FOLDER) / "choropleths.json")

    with pathlib.Path(pathlib.Path(settings.MAP_ENGINE_STYLES_FOLDER) / "layer_styles.json").open(
        "r", encoding="utf-8"
    ) as layer_styles_file:
        MAP_ENGINE_LAYER_STYLES = json.load(layer_styles_file)
    MAP_ENGINE_LAYER_STYLES.update(MAP_ENGINE_CHOROPLETHS.get_static_styles())

    # REGIONS
    MAP_ENGINE_MIN_ZOOM = 8
    MAP_ENGINE_MAX_ZOOM = 22
    MAP_ENGINE_MAX_DISTILLED_ZOOM = 10
    MAP_ENGINE_CLUSTER_ZOOM = 11

    # MAP
    MAP_ENGINE_IMAGES = []

    # DISTILL
    X_AT_MIN_Z = 136
    Y_AT_MIN_Z = 84
    X_OFFSET = 1  # Defines how many tiles to the right are added at first level
    Y_OFFSET = 1  # Defines how many tiles to the bottom are added at first level

    MAP_ENGINE_ZOOM_LEVELS = {}
    MAP_ENGINE_REGIONS = []

    class Meta:
        proxy = True
