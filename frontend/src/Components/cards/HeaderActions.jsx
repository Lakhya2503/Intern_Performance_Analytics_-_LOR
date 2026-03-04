import React from 'react';
import PropTypes from 'prop-types';
import {
  FaCloudUploadAlt,
  FaUsers,
  FaSync,
  FaStar,
  FaThLarge,
  FaList,
  FaExclamationTriangle
} from 'react-icons/fa';
import ActionButton from '../cards/ActionButton';

const HeaderActions = ({
  viewMode,
  onViewChange,
  onBulkUpload,
  onTemplateUpload,
  onShowRejected,
  onShowShortlisted,
  onRefresh,
  stats,
  loading,
  fileInputRef
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* View Toggle */}
      <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
        <ActionButton
          icon={FaThLarge}
          onClick={() => onViewChange('card')}
          active={viewMode === 'card'}
          title="Card View"
          variant="header"
        />
        <ActionButton
          icon={FaList}
          onClick={() => onViewChange('list')}
          active={viewMode === 'list'}
          title="List View"
          variant="header"
        />
      </div>

      {/* Bulk Upload */}
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onBulkUpload}
          accept=".xlsx,.xls,.csv"
          className="hidden"
          id="bulk-upload-file"
        />
        <ActionButton
          icon={FaUsers}
          onClick={() => fileInputRef.current?.click()}
          loading={loading.bulk}
          loadingText="Uploading..."
          title="Bulk upload interns"
          variant="header"
        >
          <span className="hidden sm:inline">
            {loading.bulk ? 'Uploading...' : 'Bulk Upload'}
          </span>
        </ActionButton>
      </div>

      {/* Template Upload */}
      <ActionButton
        icon={FaCloudUploadAlt}
        onClick={onTemplateUpload}
        title="Upload LOR template"
        variant="header"
      >
        <span className="hidden sm:inline">Upload Template</span>
      </ActionButton>

      {/* Shortlisted Button - NEW */}
      <ActionButton
        icon={FaStar}
        onClick={onShowShortlisted}
        title="View shortlisted students"
        variant="header"
        badge={stats.eligible}
        badgeColor="purple"
      >
        <span className="hidden sm:inline">Shortlisted</span>
      </ActionButton>

      {/* Rejected Button */}
      <ActionButton
        icon={FaExclamationTriangle}
        onClick={onShowRejected}
        title="View rejected requests"
        variant="header"
        badge={stats.rejected}
        badgeColor="red"
      >
        <span className="hidden sm:inline">Rejected</span>
      </ActionButton>

      {/* Refresh Button */}
      <ActionButton
        icon={FaSync}
        onClick={onRefresh}
        loading={loading.generated || loading.pending || loading.rejected || loading.eligible}
        title="Refresh data"
        variant="header"
      />
    </div>
  );
};

HeaderActions.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
  onBulkUpload: PropTypes.func.isRequired,
  onTemplateUpload: PropTypes.func.isRequired,
  onShowRejected: PropTypes.func.isRequired,
  onShowShortlisted: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  stats: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  fileInputRef: PropTypes.object.isRequired
};

export default HeaderActions;
