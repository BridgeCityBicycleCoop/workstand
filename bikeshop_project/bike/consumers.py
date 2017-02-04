import logging
import re
from typing import Dict, Union, Optional

import requests
from bs4 import BeautifulSoup
from channels import Channel
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from bike.models import Bike

logger = logging.getLogger('bikeshop')


def _is_stolen(serial: str) -> Optional[bool]:
    url = 'http://app.cpic-cipc.ca/English/searchFormResultsbikes.cfm'
    data = {'ser': serial,
            'toc': 1,
            'Submit': 'Begin Search'}

    r = requests.post(url, data=data)
    html = r.text
    soup = BeautifulSoup(html)

    no_records = r'^No Records were found in our database on.+$'
    found_records = r'^WE HAVE A RECORD ON FILE THAT MATCHES THE IDENTIFIERS THAT YOU PROVIDED.+$'
    if soup.body.findAll(text=re.compile(no_records)):
        return False
    elif soup.body.findAll(text=re.compile(found_records)):
        return True

    return None


def check_cpic(message: Dict[str, Union[str, int]]) -> None:
    """
    Makes a remote call to CPIC to determine whether a bike has been stolen.
    """
    try:
        bike = Bike.objects.get(id=message['bike_id'])
    except ObjectDoesNotExist:
        logger.error(f'check_epic: Invalid Bike id: {message["bike_id"]}')
        return

    stolen = _is_stolen(message['serial_number'])

    if stolen:
        logging.info(f'check_epic: CPIC records found the bike with serial number: '
                     f'{message["serial_number"]} is stolen')
        bike.cpic_searched_at = timezone.now()
        bike.stolen = True
    elif stolen is None:
        logger.error(f'check_epic: Unable to check CPIC records with serial number: {message["serial_number"]}.')
        return
    else:
        logging.info(f'check_epic: CPIC records found the bike with serial number: '
                     f'{message["serial_number"]} is clear.')
        bike.cpic_searched_at = timezone.now()
        bike.stolen = False

    bike.save()
    response = {'stolen': stolen}
    response.update(message)

    Channel('check-cpic').send(response)
