from flask import request
from flask_restful import reqparse, marshal
import services.dataset_service
from controllers.service_api import api
from controllers.service_api.dataset.error import DatasetNameDuplicateError
from controllers.service_api.wraps import DatasetApiResource
from core.login.login import current_user
from core.model_providers.models.entity.model_params import ModelType
from extensions.ext_database import db
from fields.dataset_fields import dataset_detail_fields
from models.account import Account, TenantAccountJoin
from models.dataset import Dataset
from services.dataset_service import DatasetService
from services.provider_service import ProviderService


def _validate_name(name):
    if not name or len(name) < 1 or len(name) > 40:
        raise ValueError('Name must be between 1 to 40 characters.')
    return name


class DatasetApi(DatasetApiResource):
    """Resource for get datasets."""

    def get(self, tenant_id):
        page = request.args.get('page', default=1, type=int)
        limit = request.args.get('limit', default=20, type=int)
        provider = request.args.get('provider', default="vendor")
        datasets, total = DatasetService.get_datasets(page, limit, provider,
                                                      tenant_id, current_user)
        # check embedding setting
        provider_service = ProviderService()
        valid_model_list = provider_service.get_valid_model_list(current_user.current_tenant_id,
                                                                 ModelType.EMBEDDINGS.value)
        model_names = []
        for valid_model in valid_model_list:
            model_names.append(f"{valid_model['model_name']}:{valid_model['model_provider']['provider_name']}")
        data = marshal(datasets, dataset_detail_fields)
        for item in data:
            if item['indexing_technique'] == 'high_quality':
                item_model = f"{item['embedding_model']}:{item['embedding_model_provider']}"
                if item_model in model_names:
                    item['embedding_available'] = True
                else:
                    item['embedding_available'] = False
            else:
                item['embedding_available'] = True
        response = {
            'data': data,
            'has_more': len(datasets) == limit,
            'limit': limit,
            'total': total,
            'page': page
        }
        return response, 200

    """Resource for datasets."""

    def post(self, tenant_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', nullable=False, required=True,
                            help='type is required. Name must be between 1 to 40 characters.',
                            type=_validate_name)
        parser.add_argument('indexing_technique', type=str, location='json',
                            choices=('high_quality', 'economy'),
                            help='Invalid indexing technique.')
        args = parser.parse_args()

        try:
            dataset = DatasetService.create_empty_dataset(
                tenant_id=tenant_id,
                name=args['name'],
                indexing_technique=args['indexing_technique'],
                account=current_user
            )
        except services.errors.dataset.DatasetNameDuplicateError:
            raise DatasetNameDuplicateError()

        return marshal(dataset, dataset_detail_fields), 200


api.add_resource(DatasetApi, '/datasets')

