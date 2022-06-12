TEST_DATA_SCHEMA = {
    # "title": "Задача",
    "type": "object",
    "options": {
        "class": "bg-dark",
        "show_errors": "change",
        "disable_properties": "true",
        "startval": """
            {
                "type": "Longer text answer"
            }
        
        """
    },
    "oneOf": [
        {
            "title": "Choose correct answers",
            "properties": {
                # "type": {
                #     "type": "string",
                #     "default": "Choose correct answers",
                #     "options": {
                #         "hidden": "true"
                #     }
                # },
                "answers": {
                    "type": "array",
                    "title": "answers",
                    "format": "table",
                    "items": {
                        "type": "object",
                        "title": "answer",
                        "properties": {
                            "text": {
                                "type": "string",
                                "minLength": "1"
                            },
                            "is_correct": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            }
        },
        {
            "title": "Correct mistakes in the text",
            "properties": {
                # "type": {
                #     "type": "string",
                #     "default": "Correct mistakes in text",
                #     "options": {
                #         "hidden": "true"
                #     }
                # },
                "answers": {
                    "type": "array",
                    "title": "answers",
                    "format": "table",
                    "items": {
                        "type": "object",
                        "title": "answer",
                        "properties": {
                            "position": {
                                "type": "integer"
                            },
                            "correct": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        {
            "title": "Short text answer",
            "properties": {
                # "type": {
                #     "type": "string",
                #     "default": "Short text answer",
                #     "options": {
                #         "hidden": "true"
                #     }
                # },
                "answers": {
                    "type": "array",
                    "title": "correct answers",
                    "format": "table",
                    "items": {
                        "title": "correct answer",
                        "type": "string"
                    }
                }
            }
        },
        {
            "title": "Longer text answer",
            "properties": {
                "type": {
                    "type": "string",
                    "default": "Longer text answer",
                    "options": {
                        "hidden": "true"
                    }
                }
            }
        }
    ]
}