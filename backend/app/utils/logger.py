import logging

def configure_logger(app):
    logging.basicConfig(level=logging.INFO, 
                        format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
    app.logger.setLevel(logging.INFO)
