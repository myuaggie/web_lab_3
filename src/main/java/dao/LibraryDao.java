package dao;

import model.UQ_Library;
import model.ULKey;

import java.util.List;

public interface LibraryDao {
    public void save(UQ_Library library);

    public void delete(UQ_Library library);

    public void update(UQ_Library library);

    public UQ_Library getLibraryByKey(ULKey key);

    public List<UQ_Library> getAllLibrariesById(int id);

    public List<UQ_Library> getAllLibraries();
}
