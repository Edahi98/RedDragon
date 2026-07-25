class PipelineService:
    """Aplica transformaciones sobre la estructura JSON de un pipeline."""

    def replace_data(self, pipeline, extracted_data):
        return self._replace_data_keys(pipeline, extracted_data)

    def _replace_data_keys(self, obj, extracted_data):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "data":
                    obj[key] = {"dato": extracted_data}
                else:
                    self._replace_data_keys(value, extracted_data)
        elif isinstance(obj, list):
            for item in obj:
                self._replace_data_keys(item, extracted_data)

        return obj
